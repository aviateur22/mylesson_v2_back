User(id,email, login, password, #token_id, #role_id)
Role(id,name)
Token(id,value)
Lesson(id, title, content, #user_id)
Tag(id, name,  #image_id)
Image(id, path, name)
LessonHasTag(id, #lesson_id, #tag_id)

