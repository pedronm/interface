export default async function Base64Helper(texto, context){

   return new Promise(
        () => 
            {   
                var tmp = texto.split(",");
                var prefix = tmp[0];
                var contentType = prefix.split(/[:;]+/)[1];
                var byteCharacters = atob(tmp[1]);

                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], {type: contentType});
                var blobUrl = URL.createObjectURL(blob)
                context.open(blobUrl, "popup","width=1000,height=500,scrollbars=1,resizable=no," +
                "toolbar=no,directories=no,location=no,menubar=no,status=no,left=0,top=0");
                resolve(blobUrl)
            }      
    
    )
}