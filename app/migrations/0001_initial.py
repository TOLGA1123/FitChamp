# Generated by Django 5.0.4 on 2024-04-23 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('User_ID', models.CharField(max_length=11, primary_key=True, serialize=False, unique=True)),
                ('User_name', models.CharField(max_length=20)),
                ('Email', models.EmailField(max_length=254, unique=True)),
                ('Password', models.CharField(max_length=20)),
                ('is_admin', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
