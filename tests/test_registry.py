"""Tests for command registry."""

import pytest

from ops_tui.registry import CommandRegistry


def test_register_and_get_command():
    """Test registering and retrieving a command."""
    registry = CommandRegistry()

    def test_handler():
        return "test result"

    registry.register("test", test_handler, "Test command")

    cmd = registry.get("test")
    assert cmd is not None
    assert cmd["handler"] == test_handler
    assert cmd["description"] == "Test command"


def test_register_with_aliases():
    """Test command registration with aliases."""
    registry = CommandRegistry()

    def test_handler():
        return "test result"

    registry.register("test", test_handler, "Test command", aliases=["t", "tst"])

    # Primary name should work
    assert registry.get("test") is not None

    # Aliases should work
    assert registry.get("t") is not None
    assert registry.get("tst") is not None

    # All should point to same command
    assert registry.get("test") == registry.get("t")
    assert registry.get("test") == registry.get("tst")


def test_execute_command():
    """Test executing a registered command."""
    registry = CommandRegistry()

    def test_handler(x, y):
        return x + y

    registry.register("add", test_handler, "Add two numbers")

    result = registry.execute("add", 3, 5)
    assert result == 8


def test_execute_nonexistent_command():
    """Test executing a command that doesn't exist."""
    registry = CommandRegistry()

    with pytest.raises(KeyError, match="Command 'nonexistent' not found"):
        registry.execute("nonexistent")


def test_list_commands():
    """Test listing all registered commands."""
    registry = CommandRegistry()

    def handler1():
        pass

    def handler2():
        pass

    registry.register("cmd1", handler1, "First command")
    registry.register("cmd2", handler2, "Second command", aliases=["c2"])

    commands = registry.list_commands()
    assert len(commands) == 2
    assert "cmd1" in commands
    assert commands["cmd1"] == "First command"
    # Should have either cmd2 or c2, but not both (filtering aliases)
    assert "cmd2" in commands or "c2" in commands


def test_register_empty_name():
    """Test that registering with empty name raises ValueError."""
    registry = CommandRegistry()

    def test_handler():
        pass

    with pytest.raises(ValueError, match="Command name cannot be empty"):
        registry.register("", test_handler)


def test_register_non_callable():
    """Test that registering non-callable handler raises TypeError."""
    registry = CommandRegistry()

    with pytest.raises(TypeError, match="Handler must be callable"):
        registry.register("test", "not a function")
