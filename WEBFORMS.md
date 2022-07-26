How to set up Webform REST on ACMS

1.Download the Webform and Webform REST modules

2.Enable REST resources "Webform Submit", "Webform Elements", "Webform Submission" on `/admin/config/services/rest`

3.Set permissions `/admin/people/permissions#module-rest` for RESTful Web Services and check Anonymous User for the Webform related permissions to avoid dealing with auth/headers for now.

4.Create a new webform if you have not already `/admin/structure/webform`

5.Code is currently hardcoded to render the basic email contact webform on the page which I think should already be pre-made as an example
on `/admin/structure/types/manage/article/fields`. 
In case it's not, create a webform where
- webform_id should be 'contact'
- there should be a name field, email field, subject field, and message field.

6.Add a webform to one of the article nodes.

7.Visit the article node on the headless site.

8.Now you should be able to make requests to the API too. ex) GET`/webform_rest/{webform_id}/fields?_format=json`

