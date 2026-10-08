# Basic Workflow Builder

**Description**: Build basic ComfyUI text-to-image workflows from natural language descriptions.

## When to use this skill

Use this skill when the user wants to:
- Create a simple text-to-image workflow
- Generate images from text prompts
- Build a basic SDXL or Stable Diffusion workflow
- Set up a workflow with KSampler, VAE decode, and save nodes

## Instructions

When the user describes what they want to create:

1. **Understand the request**: Identify the core image generation task
2. **Select appropriate model**: Ask which model to use if not specified (SDXL, SD1.5, etc.)
3. **Build the workflow**:
   - Add a `CheckpointLoaderSimple` node for the model
   - Add a `CLIPTextEncode` node for the positive prompt
   - Add a `CLIPTextEncode` node for the negative prompt
   - Add a `KSampler` node for sampling
   - Add a `VAEDecode` node to decode latents
   - Add a `SaveImage` node to save the output
4. **Connect the nodes**: Connect the outputs/inputs in the correct order
5. **Set default values**:
   - KSampler steps: 20-30
   - KSampler cfg: 7.0-8.0
   - KSampler seed: random
   - Negative prompt: "blurry, low quality, distorted"

## Example workflows

### Simple text-to-image
```
CheckpointLoaderSimple -> CLIP (clip) -> CLIPTextEncode (positive)
CheckpointLoaderSimple -> VAE (vae) -> VAEDecode -> SaveImage
CheckpointLoaderSimple -> MODEL (model) -> KSampler -> VAEDecode
CLIPTextEncode (positive) -> KSampler (positive)
CLIPTextEncode (negative) -> KSampler (negative)
EmptyLatentImage -> KSampler (latent_image)
```

## Tips

- Always ask for the prompt if not provided
- Suggest appropriate steps based on the model (SDXL: 20-30, SD1.5: 20-50)
- Offer to add LoRA nodes if the user mentions specific styles
- Ask about image dimensions (default: 1024x1024 for SDXL, 512x512 for SD1.5)
