"""LLM provider implementations for Comfy Open Agent."""

import json
import asyncio
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import httpx


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str,
        **kwargs
    ) -> str:
        """
        Send chat completion request.

        Args:
            messages: Chat messages
            model: Model name
            **kwargs: Additional parameters

        Returns:
            Response text
        """
        pass


class LocalLLMProvider(LLMProvider):
    """Local LLM provider (Ollama-compatible)."""

    def __init__(self, base_url: str = "http://localhost:11434"):
        """
        Initialize local LLM provider.

        Args:
            base_url: Base URL for the local LLM server
        """
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(timeout=120.0)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str,
        **kwargs
    ) -> str:
        """
        Send chat completion request to local LLM.

        Args:
            messages: Chat messages
            model: Model name
            **kwargs: Additional parameters

        Returns:
            Response text
        """
        url = f"{self.base_url}/api/chat"

        payload = {
            "model": model,
            "messages": messages,
            "stream": False,
        }

        response = await self.client.post(url, json=payload)
        response.raise_for_status()

        data = response.json()
        return data.get("message", {}).get("content", "")

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


class OpenAIProvider(LLMProvider):
    """OpenAI API provider."""

    def __init__(self, api_key: str, base_url: str = "https://api.openai.com/v1"):
        """
        Initialize OpenAI provider.

        Args:
            api_key: OpenAI API key
            base_url: Base URL for OpenAI API
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(
            timeout=120.0,
            headers={"Authorization": f"Bearer {api_key}"}
        )

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str,
        **kwargs
    ) -> str:
        """
        Send chat completion request to OpenAI.

        Args:
            messages: Chat messages
            model: Model name
            **kwargs: Additional parameters

        Returns:
            Response text
        """
        url = f"{self.base_url}/chat/completions"

        payload = {
            "model": model,
            "messages": messages,
        }

        response = await self.client.post(url, json=payload)
        response.raise_for_status()

        data = response.json()
        return data["choices"][0]["message"]["content"]

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


class AnthropicProvider(LLMProvider):
    """Anthropic API provider."""

    def __init__(self, api_key: str, base_url: str = "https://api.anthropic.com"):
        """
        Initialize Anthropic provider.

        Args:
            api_key: Anthropic API key
            base_url: Base URL for Anthropic API
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.client = httpx.AsyncClient(
            timeout=120.0,
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            }
        )

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str,
        **kwargs
    ) -> str:
        """
        Send chat completion request to Anthropic.

        Args:
            messages: Chat messages
            model: Model name
            **kwargs: Additional parameters

        Returns:
            Response text
        """
        url = f"{self.base_url}/v1/messages"

        # Convert OpenAI-style messages to Anthropic format
        system_message = None
        user_messages = []

        for msg in messages:
            if msg["role"] == "system":
                system_message = msg["content"]
            else:
                user_messages.append({
                    "role": msg["role"],
                    "content": msg["content"],
                })

        payload = {
            "model": model,
            "messages": user_messages,
        }

        if system_message:
            payload["system"] = system_message

        response = await self.client.post(url, json=payload)
        response.raise_for_status()

        data = response.json()
        return data["content"][0]["text"]

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


class LLMProviderFactory:
    """Factory for creating LLM providers."""

    @staticmethod
    def create_provider(
        provider_type: str,
        **config
    ) -> LLMProvider:
        """
        Create an LLM provider instance.

        Args:
            provider_type: Type of provider ('local', 'openai', 'anthropic')
            **config: Provider configuration

        Returns:
            LLMProvider instance
        """
        if provider_type == "local":
            base_url = config.get("base_url", "http://localhost:11434")
            return LocalLLMProvider(base_url=base_url)
        elif provider_type == "openai":
            api_key = config.get("api_key", "")
            base_url = config.get("base_url", "https://api.openai.com/v1")
            if not api_key:
                raise ValueError("API key is required for OpenAI provider")
            return OpenAIProvider(api_key=api_key, base_url=base_url)
        elif provider_type == "anthropic":
            api_key = config.get("api_key", "")
            base_url = config.get("base_url", "https://api.anthropic.com")
            if not api_key:
                raise ValueError("API key is required for Anthropic provider")
            return AnthropicProvider(api_key=api_key, base_url=base_url)
        else:
            raise ValueError(f"Unknown provider type: {provider_type}")
