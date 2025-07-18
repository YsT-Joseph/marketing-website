'''
import polib
import os

# Path to your locale folder
# Example: 'locale/ar/LC_MESSAGES/django.po'
po_path = 'locale/ar/LC_MESSAGES/django.po'  # Change this path as needed

# Corresponding .mo file path
mo_path = po_path.replace('.po', '.mo')

# Load the .po file
po = polib.pofile(po_path)

# Save it as a compiled .mo file
po.save_as_mofile(mo_path)

print(f"Compiled '{po_path}' to '{mo_path}' successfully.")
'''