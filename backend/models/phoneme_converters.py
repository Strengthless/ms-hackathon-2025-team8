import eng_to_ipa
from .interfaces import ITextToPhonemModel


class EngPhonemConverter(ITextToPhonemModel):
    def __init__(self) -> None:
        pass

    def convertToPhonem(self, sentence: str) -> str:
        phonem_representation = eng_to_ipa.convert(sentence)
        phonem_representation = phonem_representation.replace('*', '')
        return phonem_representation


def get_phonem_converter(language: str = "en"):
    """Get phoneme converter for the specified language (only English supported)."""
    if language == 'en':
        return EngPhonemConverter()
    else:
        raise ValueError('Only English (en) language is supported')
