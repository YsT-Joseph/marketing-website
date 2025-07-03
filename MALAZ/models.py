from django.db import models

# Manually defining the choices as a list of tuples
SIZE_CHOICES = [
    ("S", "Small"),
    ("M", "Medium"),
    ("L", "Large"),
    ("xl", "X-Large"),
    ("xxl", "XX-Large"),
    ("xxxl", "XXX-Large")
]

class Clothes(models.Model):
    name = models.CharField(blank=False, null=False, max_length=200)
    price = models.FloatField()
    image = models.ImageField(upload_to='users_imgs')
    description = models.TextField(max_length=200)
    size = models.CharField(choices=SIZE_CHOICES, max_length=5)
    

    class Meta:
        verbose_name_plural = 'clothes'

    def __str__(self):
        return self.name
