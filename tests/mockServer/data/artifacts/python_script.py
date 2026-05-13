"""
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
"""

import asyncio
import functools
import logging
from datetime import datetime
from typing import List, Dict, Optional, Union

# Global constant
DEFAULT_TIMEOUT = 30

def debug_logger(func):
    """Decorator to log function execution."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args} {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

class BaseArtifact:
    """Base class for all artifacts."""
    def __init__(self, name: str, metadata: Optional[Dict] = None):
        self.name = name
        self.metadata = metadata or {}
        self.created_at = datetime.now()

    def get_info(self) -> str:
        return f"Artifact: {self.name}, Created: {self.created_at}"

class CodeArtifact(BaseArtifact):
    """Specific implementation for code artifacts."""
    def __init__(self, name: str, language: str, source_code: str):
        super().__init__(name)
        self.language = language
        self.source_code = source_code
        self.tags: List[str] = []

    @debug_logger
    def add_tag(self, tag: str) -> None:
        if tag not in self.tags:
            self.tags.append(tag)

    async def analyze_code(self) -> Dict[str, Union[int, str]]:
        """Mock async code analysis."""
        await asyncio.sleep(0.1)
        lines = self.source_code.split("\n")
        return {
            "num_lines": len(lines),
            "complexity": "low" if len(lines) < 50 else "medium",
            "status": "completed"
        }

def process_artifacts(artifacts: List[BaseArtifact]) -> List[str]:
    """Process a list of artifacts using list comprehension."""
    return [art.get_info() for art in artifacts if art.name.startswith("v1")]

async def main():
    # Example usage of various constructions
    raw_code = """
    def hello():
        return "world"
    """
    
    python_art = CodeArtifact("v1_main_script", "python", raw_code)
    python_art.add_tag("production")
    python_art.add_tag("mlrun")

    print(f"Artifact tags: {python_art.tags}")

    # Async operations
    analysis_result = await python_art.analyze_code()
    print(f"Analysis: {analysis_result}")

    # Data structures and filtering
    all_arts = [
        python_art,
        BaseArtifact("v1_config"),
        BaseArtifact("experimental_model")
    ]
    
    processed = process_artifacts(all_arts)
    for info in processed:
        print(info)

    # Exception handling
    try:
        raise ValueError("Something went wrong")
    except ValueError as e:
        logging.error(f"Caught expected error: {e}")
    finally:
        print("Cleanup complete")

    # Dictionary comprehension
    summary = {art.name: art.created_at.isoformat() for art in all_arts}
    print(f"Summary: {summary}")

    # Set operations
    unique_tags = {"dev", "prod", "dev"}
    print(f"Unique tags: {unique_tags}")

if __name__ == "__main__":
    asyncio.run(main())

# More lines to reach the 100 mark
# ---------------------------------------------------------
# Documentation Section
# ---------------------------------------------------------
# This script serves as a mock artifact for UI testing.
# It includes:
# - Classes and Inheritance
# - Decorators
# - Asynchronous programming (async/await)
# - Type Hinting
# - List and Dictionary Comprehensions
# - Exception Handling
# - Logging
# - String Formatting (f-strings)
# - Global and Local variables
# - Standard Library imports (asyncio, datetime, logging, functools)
# ---------------------------------------------------------
