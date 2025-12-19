"""CLI entry point for ops TUI."""

import sys
from typing import List, Optional

from ops_tui.registry import list_commands, execute_command, get_command


def print_help() -> None:
    """Print help message with available commands."""
    print("Ops TUI - Operations Terminal User Interface")
    print("\nUsage: ops-tui <command> [args...]")
    print("\nAvailable commands:")
    commands = list_commands()
    if not commands:
        print("  No commands registered")
    else:
        for name, desc in sorted(commands.items()):
            print(f"  {name:20} {desc}")
    print("\nUse 'ops-tui help <command>' for command-specific help")


def main(argv: Optional[List[str]] = None) -> int:
    """Main CLI entry point.

    Args:
        argv: Command-line arguments (defaults to sys.argv[1:])

    Returns:
        Exit code (0 for success, non-zero for error)
    """
    if argv is None:
        argv = sys.argv[1:]

    if not argv or argv[0] in ("help", "-h", "--help"):
        print_help()
        return 0

    command_name = argv[0]
    command_args = argv[1:]

    cmd = get_command(command_name)
    if cmd is None:
        print(f"Error: Unknown command '{command_name}'", file=sys.stderr)
        print("\nRun 'ops-tui help' to see available commands", file=sys.stderr)
        return 1

    try:
        result = execute_command(command_name, *command_args)
        if result is not None:
            print(result)
        return 0
    except Exception as e:
        print(f"Error executing command '{command_name}': {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
