"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from backend import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/',views.user),
    path('user',views.user),
    path('user_posts/',views.user_post_list),
    path('user_posts',views.user_post_list),
    path('feed_posts/',views.feed_post_list),
    path('feed_posts',views.feed_post_list),
    path('all_users/',views.user_list),
    path('all_users',views.user_list),
    path('search_user/',views.search_user),
    path('search_user',views.search_user),
    path('signup/',views.signup),
    path('signup',views.signup),
    path('login/',views.login),
    path('login',views.login),
  

]