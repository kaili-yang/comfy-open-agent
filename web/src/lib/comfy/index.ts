// Resolved to the typing stubs in web/scripts/ at build time; vite.config.mts
// rewrites them to ComfyUI's /scripts/*.js in the bundle.
import { api } from '../../../scripts/api.js'
import { app } from '../../../scripts/app.js'

export type * from '../../../scripts/comfy-types'
export { api, app }
