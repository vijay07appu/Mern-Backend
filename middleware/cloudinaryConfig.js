import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
// cloudinary.config({ 
//   cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret:process.env.CLOUDINARY_API_SECRET 
// });


          
cloudinary.config({ 
  cloud_name: 'dljwq0w7u', 
  api_key: '635692629455959', 
  api_secret: 'RJkFI2QsXoZw6jhJ_-U7AX41BM8' 
});



const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) 
      {
        console.log("local path not present")
        return null
      }
        
      //upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
          folder:'products'
      })
      // file has been uploaded successfull
      console.log("file is uploaded on cloudinary ", response.url);
      fs.unlinkSync(localFilePath)

      console.log("response secure url is ")
      console.log(response.secure_url)

      return response;

  } catch (error) {
    console.log("error in cloudinaryConfig")
    console.log(error)
      fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
      return null;
  }
}

  export {uploadOnCloudinary}