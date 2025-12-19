"""Command registry for ops TUI.

This module provides a central registry for all TUI commands,
allowing dynamic command discovery and execution.
"""

from typing import Dict, Callable, Optional, Any


class CommandRegistry:
    """Registry for TUI commands with validation and execution capabilities."""

    def __init__(self):
        """Initialize the command registry."""
        self._commands: Dict[str, Dict[str, Any]] = {}

    def register(
        self,
        name: str,
        handler: Callable,
        description: str = "",
        aliases: Optional[list] = None
    ) -> None:
        """Register a command with the registry.

        Args:
            name: Command name (primary identifier)
            handler: Callable that executes the command
            description: Human-readable description
            aliases: Optional list of alternative names
        """
        if not name:
            raise ValueError("Command name cannot be empty")
        if not callable(handler):
            raise TypeError("Handler must be callable")

        self._commands[name] = {
            "handler": handler,
            "description": description,
            "aliases": aliases or []
        }

        # Register aliases
        for alias in (aliases or []):
            self._commands[alias] = self._commands[name]

    def get(self, name: str) -> Optional[Dict[str, Any]]:
        """Get a command by name or alias.

        Args:
            name: Command name or alias

        Returns:
            Command info dict or None if not found
        """
        return self._commands.get(name)

    def execute(self, name: str, *args, **kwargs) -> Any:
        """Execute a registered command.

        Args:
            name: Command name or alias
            *args: Positional arguments to pass to handler
            **kwargs: Keyword arguments to pass to handler

        Returns:
            Result from command handler

        Raises:
            KeyError: If command not found
        """
        cmd = self.get(name)
        if cmd is None:
            raise KeyError(f"Command '{name}' not found")

        return cmd["handler"](*args, **kwargs)

    def list_commands(self) -> Dict[str, str]:
        """List all registered commands with descriptions.

        Returns:
            Dict mapping command names to descriptions
        """
        # Filter out aliases to show only primary commands
        commands = {}
        seen = set()
        for name, info in self._commands.items():
            handler_id = id(info["handler"])
            if handler_id not in seen:
                commands[name] = info["description"]
                seen.add(handler_id)
        return commands


# Global registry instance
_registry = CommandRegistry()


def register_command(
    name: str,
    handler: Callable,
    description: str = "",
    aliases: Optional[list] = None
) -> None:
    """Register a command with the global registry.

    Args:
        name: Command name
        handler: Callable that executes the command
        description: Human-readable description
        aliases: Optional list of alternative names
    """
    _registry.register(name, handler, description, aliases)


def get_command(name: str) -> Optional[Dict[str, Any]]:
    """Get a command from the global registry.

    Args:
        name: Command name or alias

    Returns:
        Command info dict or None if not found
    """
    return _registry.get(name)


def execute_command(name: str, *args, **kwargs) -> Any:
    """Execute a command from the global registry.

    Args:
        name: Command name or alias
        *args: Positional arguments
        **kwargs: Keyword arguments

    Returns:
        Result from command handler
    """
    return _registry.execute(name, *args, **kwargs)


def list_commands() -> Dict[str, str]:
    """List all commands in the global registry.

    Returns:
        Dict mapping command names to descriptions
    """
    return _registry.list_commands()
