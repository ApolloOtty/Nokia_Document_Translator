from googletrans import Translator
import database_connection

def translate_text(text, dest_language, src_language='auto'):
    
    translator = Translator()
    translated = translator.translate(text, dest=dest_language, src=src_language)
    return translated.text
