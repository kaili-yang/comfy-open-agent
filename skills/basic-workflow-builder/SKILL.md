---
name: basic-workflow-builder
description: Build a standard text-to-image workflow (checkpoint -> prompts -> KSampler -> VAE decode -> save) for SD1.5/SDXL-style checkpoints.
---

# Basic Workflow Builder

## When to use

The user wants a plain text-to-image workflow, or wants to start from one
before adding LoRAs, upscaling, or other steps.

## Steps

1. Pick the model: call `list_models` with `folder="checkpoints"` and use an
   exact file name from the result. If several fit and the user did not say
   which, ask.
2. Read `references/text2img-api.json` with `read_skill` (file argument). It
   is a complete API-format workflow.
3. Fill in:
   - node 1 `ckpt_name`: the chosen checkpoint
   - node 2 `text`: the positive prompt (ask if the user gave none)
   - node 3 `text`: the negative prompt (default `blurry, low quality, distorted`)
   - node 4 `width`/`height`: 512x512 for SD1.5, 1024x1024 for SDXL, unless asked otherwise
   - node 5 `seed`: a random integer; `steps` 20–30; `cfg` 7
4. Call `load_workflow` with the filled workflow. If the canvas already has
   work on it, ask before replacing it.
5. Only call `queue_workflow` if the user asked for an image. Then wait with
   `get_run_status` and check the result with `view_image`.

## Variations

- **LoRA**: insert `LoraLoader` between the checkpoint and its consumers:
  checkpoint MODEL/CLIP -> LoraLoader -> KSampler `model` and both
  CLIPTextEncode `clip` inputs. Pick the file with `list_models` (`loras`).
- **Batch**: raise `batch_size` on `EmptyLatentImage`.
- **Different sampler**: check the allowed `sampler_name` / `scheduler`
  values with `get_node_info` before setting them.
