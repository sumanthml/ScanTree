from abc import ABC
from abc import abstractmethod


class BaseAIProvider(
    ABC
):

    @abstractmethod
    def generate_medical_insights(
        self,
        report_text: str
    ):
        pass