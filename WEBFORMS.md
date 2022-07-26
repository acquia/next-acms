How to set up Webform REST on ACMS

1. Download the Webform and Webform REST modules
<br></br>
2. Enable REST resources "Webform Submit", "Webform Elements", "Webform Submission" on /admin/config/services/rest
<br></br>
3. Set permissions `/admin/people/permissions#module-rest` for RESTful Web Services and check Anonymous User for the Webform related permissions to avoid dealing with auth/headers for now.
<br></br>
4. Create a new webform if you have not already `/admin/structure/webform`
<br></br>
5. Go to article content type and create a webform field on `/admin/structure/types/manage/article/fields`
<br></br>
6. Add a webform to one of the article nodes.
<br></br>
7. Now you should be able to make requests to the API. ex) GET`/webform_rest/{webform_id}/fields?_format=json`

