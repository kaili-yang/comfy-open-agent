"""Bridge that forwards canvas operations to a connected ComfyUI browser tab.

The LiteGraph canvas only exists in the browser, so graph-editing tools are
sent over ComfyUI's websocket as a custom event. The tab executes the
operation and posts the result back to /comfy-open-agent/bridge/result.
"""

import asyncio
import time
import uuid
from typing import Any, Dict, List, Optional

TOOL_CALL_EVENT = "comfy-open-agent.tool_call"
DEFAULT_TIMEOUT_S = 30.0


class BridgeError(Exception):
    pass


class CanvasBridge:
    def __init__(self) -> None:
        self._pending: Dict[str, asyncio.Future] = {}
        # client_id -> last time the tab announced itself
        self._clients: Dict[str, float] = {}

    def register_client(self, client_id: str) -> None:
        self._clients[client_id] = time.time()

    def _connected_clients(self) -> List[str]:
        sockets = _server().sockets
        return [cid for cid in self._clients if cid in sockets]

    def pick_client(self, preferred: Optional[str] = None) -> Optional[str]:
        connected = self._connected_clients()
        if preferred and preferred in connected:
            return preferred
        if not connected:
            return None
        return max(connected, key=lambda cid: self._clients[cid])

    def has_client(self) -> bool:
        return self.pick_client() is not None

    async def call(
        self,
        op: str,
        args: Dict[str, Any],
        client_id: Optional[str] = None,
        timeout: float = DEFAULT_TIMEOUT_S,
    ) -> Any:
        target = self.pick_client(client_id)
        if target is None:
            raise BridgeError(
                "No ComfyUI browser tab is connected. Open the ComfyUI web UI "
                "(with Comfy Open Agent installed) and try again."
            )

        call_id = uuid.uuid4().hex
        future = asyncio.get_running_loop().create_future()
        self._pending[call_id] = future
        try:
            await _server().send_json(
                TOOL_CALL_EVENT, {"call_id": call_id, "op": op, "args": args}, target
            )
            reply = await asyncio.wait_for(future, timeout)
        except asyncio.TimeoutError:
            raise BridgeError(f"The browser tab did not answer '{op}' within {timeout:.0f}s")
        finally:
            self._pending.pop(call_id, None)

        if not reply.get("ok", False):
            raise BridgeError(reply.get("error") or f"'{op}' failed in the browser")
        return reply.get("result")

    def resolve(self, call_id: str, reply: Dict[str, Any]) -> bool:
        future = self._pending.get(call_id)
        if future is None or future.done():
            return False
        future.set_result(reply)
        return True


def _server():
    from server import PromptServer

    return PromptServer.instance


bridge = CanvasBridge()
