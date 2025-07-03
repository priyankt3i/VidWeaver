import os

import pytest
from dotenv import load_dotenv
from fastapi.testclient import TestClient

# Load environment variables before importing the app
# to ensure the API_KEY is available for the test.
load_dotenv()

# This check is important for skipping the test if no API key is present,
# which is good practice for CI/CD environments or other developers.
API_KEY = os.getenv("API_KEY")
REASON_TO_SKIP = "API_KEY not found in .env file. Skipping integration test."

# Import the app after loading env vars
from main import app

# Create a test client to make requests to the app
client = TestClient(app)


@pytest.mark.skipif(not API_KEY, reason=REASON_TO_SKIP)
def test_generate_script_integration_with_google_ai():
    """
    This is an INTEGRATION TEST. It makes a real API call to the Google AI service.
    It verifies that the /generate-script endpoint can successfully communicate
    with the external service and parse its response.
    """
    # 1. Define mock project data to send to the endpoint. This simulates
    #    the data your frontend would send.
    mock_project_data = {
        "name": "Test Tutorial",
        "files": [
            {
                "id": "file-1",
                "file": {"name": "intro.txt"},
                "summary": "This document introduces the concept of FastAPI for building APIs.",
            }
        ],
        "contentType": "Tutorial",
    }

    # 2. Make a POST request to the endpoint using the test client.
    response = client.post("/generate-script", json=mock_project_data)

    # 3. Assert the response from our server was successful.
    assert response.status_code == 200, f"API call failed with status {response.status_code}: {response.text}"

    # 4. Assert the response body has the correct structure defined in our Pydantic models.
    response_data = response.json()
    assert "raw" in response_data
    assert "scenes" in response_data
    assert isinstance(response_data["raw"], str)
    assert isinstance(response_data["scenes"], list)
    assert len(response_data["raw"]) > 20  # Check that the script is not empty.