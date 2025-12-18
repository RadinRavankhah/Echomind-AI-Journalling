# reflect/llm.py
import os
import requests
from typing import Any, List
from langchain_core.language_models.llms import LLM
from langchain_core.callbacks.manager import CallbackManagerForLLMRun

class CustomLLM(LLM):
    model_name: str

    @property
    def _llm_type(self) -> str:
        return "custom_llm"

    def _call(
        self,
        prompt: str,
        stop: List[str] | None = None,
        run_manager: CallbackManagerForLLMRun | None = None,
        **kwargs: Any,
    ) -> str:
        response = requests.post(
            f"{os.environ['CUSTOM_LLM_BASE_URL']}/generate",
            headers={
                "Authorization": f"Bearer {os.environ['CUSTOM_LLM_API_KEY']}",
                "Content-Type": "application/json",
            },
            json={
                "model": os.environ["CUSTOM_LLM_MODEL_NAME"],
                "prompt": prompt,
            },
            timeout=60,
        )

        response.raise_for_status()
        return response.json()["text"]

    @property
    def _identifying_params(self):
        return {"model_name": self.model_name}
