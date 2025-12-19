"""Sample command for ops TUI."""

from ops_tui.registry import register_command


def sample_handler(*args) -> str:
    """Execute a sample operation.

    Args:
        *args: Command arguments

    Returns:
        Sample output
    """
    if args:
        return f"Sample command executed with args: {', '.join(args)}"
    return "Sample command executed successfully"


# Register the command
register_command(
    name="sample",
    handler=sample_handler,
    description="Execute a sample operation",
    aliases=["demo", "example"]
)
