user(id, email, login, password, avatar_url, upgrade_role, #role_id)
role(id, name)
link(id, compagnie_name, picture_name,)
lesson(id, title, content, summary, #thematic_id, #user_id)
tag(id, name, #image_id)
thematic(id, name, picture_name)
image(id, name)
lesson_has_tag(id, #lesson_id, #tag_id)
user_has_link(id, link_url, #link_id, #user_id)


