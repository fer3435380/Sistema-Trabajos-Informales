from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("jobs", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="job",
            name="available_dates",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="job",
            name="capacity",
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name="job",
            name="duration",
            field=models.CharField(blank=True, default="", max_length=80),
        ),
        migrations.AddField(
            model_name="job",
            name="modality",
            field=models.CharField(blank=True, default="", max_length=40),
        ),
        migrations.AddField(
            model_name="job",
            name="requirements",
            field=models.JSONField(blank=True, default=list),
        ),
    ]
