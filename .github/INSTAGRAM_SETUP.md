# C贸mo conectar Instagram @Sismosyterremotos

1. Ve a https://developers.facebook.com/ -> Tu App -> Graph API Explorer
2. Crea un Token de larga duraci贸n con permisos:
   - instagram_basic
   - instagram_content_publish
   - pages_read_engagement
   - pages_show_list
3. Obt茅n tu IG_USER_ID:
   curl "https://graph.facebook.com/v21.0/me/accounts?access_token=TU_TOKEN"
   Luego busca el Instagram Business Account ID conectado a tu Page

4. En GitHub: Tu repo SADV41 -> Settings -> Secrets and variables -> Actions -> New repository secret:
   - Name: IG_ACCESS_TOKEN -> Value: tu token largo
   - Name: IG_USER_ID -> Value: tu ID num茅rico de Instagram

5. El bot publicar谩 autom谩tico cada 5 min cuando haya sismo M>=2.5 nuevo.

Si no pones secrets, el bot solo sube latest.jpg a GitHub Pages y actualiza /SISMOS/ y /TSEC/
