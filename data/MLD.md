user(id, email, login, password, avatar_key, request_upgrade_role, sex, reset_email_token, #role_id)
role(id, name)
link(id, compagnie_name, picture_name,)
lesson(id, title, content, summary, slug, admin_request, #thematic_id, #user_id)
tag(id, name, #image_id)
thematic(id, name, image_name)
image(id, name)
lesson_has_tag(id, #lesson_id, #tag_id)
user_has_link(id, link_url, #link_id, #user_id)
notification(id, text, new)
user_has_notification(id, #user_source_id, #user_id, #notification_id)


