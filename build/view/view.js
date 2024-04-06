"use strict";
--createPostForm.html;
-- >
    action;
"/api/posts";
method = "POST";
enctype = "multipart/form-data" >
    name;
"text";
placeholder = "Enter your post" > /textarea>
    < input;
type = "file";
name = "attachments";
multiple;
accept = "image/*, video/*" >
    type;
"submit" > Create;
Post < /button>
    < /form>;
