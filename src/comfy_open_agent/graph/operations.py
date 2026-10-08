"""Graph operations for editing ComfyUI node graphs."""

import json
import folder_paths
from typing import Dict, Any, List, Optional


class GraphOperations:
    """Handle node graph operations for the agent."""

    def __init__(self, comfy_app):
        """
        Initialize graph operations.

        Args:
            comfy_app: ComfyUI application instance
        """
        self.app = comfy_app

    def get_canvas(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get the current canvas state.

        Args:
            arguments: Tool arguments (unused)

        Returns:
            Canvas state with nodes and connections
        """
        # @ts-ignore
        graph = self.app.graph

        nodes_data = []
        for node in graph.nodes:
            node_data = {
                "id": str(node.id),
                "type": node.type,
                "pos": node.pos,
                "size": node.size,
                "inputs": [],
                "outputs": [],
                "widgets": [],
            }

            # Get input connections
            for i, input_slot in enumerate(node.inputs):
                if input_slot.link:
                    link = graph.links[input_slot.link]
                    node_data["inputs"].append({
                        "index": i,
                        "name": input_slot.name,
                        "from_node": str(link.origin_id),
                        "from_slot": link.origin_slot,
                    })

            # Get output connections
            for i, output_slot in enumerate(node.outputs):
                node_data["outputs"].append({
                    "index": i,
                    "name": output_slot.name,
                    "type": output_slot.type,
                })

            # Get widget values
            if hasattr(node, 'widgets'):
                for widget in node.widgets:
                    node_data["widgets"].append({
                        "name": widget.name,
                        "value": widget.value,
                        "type": widget.type if hasattr(widget, 'type') else 'unknown',
                    })

            nodes_data.append(node_data)

        return {
            "status": "success",
            "nodes": nodes_data,
        }

    def edit_graph(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Edit the node graph.

        Args:
            arguments: Tool arguments with operation and data

        Returns:
            Operation result
        """
        operation = arguments.get('operation')
        data = arguments.get('data', {})

        # @ts-ignore
        graph = self.app.graph

        try:
            if operation == 'add_node':
                return self._add_node(graph, data)
            elif operation == 'remove_node':
                return self._remove_node(graph, data)
            elif operation == 'connect_nodes':
                return self._connect_nodes(graph, data)
            elif operation == 'disconnect_nodes':
                return self._disconnect_nodes(graph, data)
            elif operation == 'set_widget_value':
                return self._set_widget_value(graph, data)
            else:
                return {
                    "status": "error",
                    "message": f"Unknown operation: {operation}",
                }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
            }

    def _add_node(self, graph, data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a node to the graph."""
        node_type = data.get('node_type')
        pos = data.get('pos', [100, 100])

        if not node_type:
            return {"status": "error", "message": "node_type is required"}

        # Create the node
        # @ts-ignore
        node = graph.addNode(node_type, pos[0], pos[1])

        return {
            "status": "success",
            "message": f"Added node {node_type}",
            "node_id": str(node.id),
        }

    def _remove_node(self, graph, data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove a node from the graph."""
        node_id = data.get('node_id')

        if not node_id:
            return {"status": "error", "message": "node_id is required"}

        # Find and remove the node
        node = graph.getNodeById(int(node_id))
        if node:
            graph.remove(node)
            return {
                "status": "success",
                "message": f"Removed node {node_id}",
            }

        return {"status": "error", "message": f"Node {node_id} not found"}

    def _connect_nodes(self, graph, data: Dict[str, Any]) -> Dict[str, Any]:
        """Connect two nodes."""
        from_node_id = data.get('from_node_id')
        from_slot = data.get('from_slot')
        to_node_id = data.get('to_node_id')
        to_slot = data.get('to_slot')

        if not all([from_node_id, from_slot, to_node_id, to_slot]):
            return {"status": "error", "message": "All connection parameters are required"}

        from_node = graph.getNodeById(int(from_node_id))
        to_node = graph.getNodeById(int(to_node_id))

        if not from_node or not to_node:
            return {"status": "error", "message": "One or both nodes not found"}

        # Create the connection
        # @ts-ignore
        graph.connect(from_node, from_slot, to_node, to_slot)

        return {
            "status": "success",
            "message": f"Connected {from_node_id}:{from_slot} to {to_node_id}:{to_slot}",
        }

    def _disconnect_nodes(self, graph, data: Dict[str, Any]) -> Dict[str, Any]:
        """Disconnect two nodes."""
        from_node_id = data.get('from_node_id')
        from_slot = data.get('from_slot')
        to_node_id = data.get('to_node_id')
        to_slot = data.get('to_slot')

        if not all([from_node_id, from_slot, to_node_id, to_slot]):
            return {"status": "error", "message": "All disconnection parameters are required"}

        from_node = graph.getNodeById(int(from_node_id))
        to_node = graph.getNodeById(int(to_node_id))

        if not from_node or not to_node:
            return {"status": "error", "message": "One or both nodes not found"}

        # Find and remove the link
        # @ts-ignore
        for link in from_node.outputs[from_slot].links:
            if link.origin_id == int(from_node_id) and link.target_id == int(to_node_id):
                graph.disconnect(link)
                return {
                    "status": "success",
                    "message": f"Disconnected {from_node_id}:{from_slot} from {to_node_id}:{to_slot}",
                }

        return {"status": "error", "message": "Connection not found"}

    def _set_widget_value(self, graph, data: Dict[str, Any]) -> Dict[str, Any]:
        """Set a widget value on a node."""
        node_id = data.get('node_id')
        widget_name = data.get('widget_name')
        value = data.get('value')

        if not all([node_id, widget_name, value is not None]):
            return {"status": "error", "message": "node_id, widget_name, and value are required"}

        node = graph.getNodeById(int(node_id))
        if not node:
            return {"status": "error", "message": f"Node {node_id} not found"}

        # Find and set the widget value
        if hasattr(node, 'widgets'):
            for widget in node.widgets:
                if widget.name == widget_name:
                    widget.value = value
                    return {
                        "status": "success",
                        "message": f"Set {widget_name} to {value}",
                    }

        return {"status": "error", "message": f"Widget {widget_name} not found"}

    def run_workflow(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run the current workflow.

        Args:
            arguments: Tool arguments

        Returns:
            Execution result
        """
        node_id = arguments.get('node_id')

        # @ts-ignore
        if node_id:
            # Run from specific node
            node = self.app.graph.getNodeById(int(node_id))
            if node:
                # @ts-ignore
                self.app.queuePrompt()
                return {
                    "status": "success",
                    "message": f"Queued workflow from node {node_id}",
                }
        else:
            # Run entire workflow
            # @ts-ignore
            self.app.queuePrompt()
            return {
                "status": "success",
                "message": "Queued workflow",
            }

        return {"status": "error", "message": "Failed to queue workflow"}

    def get_workflow(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get the current workflow as JSON.

        Args:
            arguments: Tool arguments (unused)

        Returns:
            Workflow JSON
        """
        # @ts-ignore
        workflow = self.app.graph.serialize()

        return {
            "status": "success",
            "workflow": workflow,
        }

    def inspect_image(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Inspect an image output.

        Args:
            arguments: Tool arguments with node_id and output_index

        Returns:
            Image information
        """
        node_id = arguments.get('node_id')
        output_index = arguments.get('output_index', 0)

        # This is a placeholder - actual implementation would fetch the image
        # from the node's output and return image data/metadata
        return {
            "status": "success",
            "message": f"Image inspection for node {node_id}, output {output_index}",
            "note": "Actual image data retrieval to be implemented",
        }

    def list_models(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        List available models.

        Args:
            arguments: Tool arguments with optional model_type

        Returns:
            List of models
        """
        model_type = arguments.get('model_type')

        # Get model paths from ComfyUI
        # @ts-ignore
        if model_type:
            models = folder_paths.get_filename_list(model_type)
        else:
            models = {}
            for key in folder_paths.folder_names_and_paths.keys():
                models[key] = folder_paths.get_filename_list(key)

        return {
            "status": "success",
            "models": models,
        }
