import './style.css'

import image1 from './assets/files/data-accesspipeline.svg'
import image2 from './assets/files/database.svg'
import image3 from './assets/files/personal-center-system-message.svg'
import image4 from './assets/files/workflowworkflow-ide.svg'
import image5 from './assets/files/Airplane.svg'

import croppedImage1 from './assets/icons/cropped_data-accesspipeline.svg'
import croppedImage2 from './assets/icons/cropped_database.svg'
import croppedImage3 from './assets/icons/cropped_personal-center-system-message.svg'
import croppedImage4 from './assets/icons/cropped_workflowworkflow-ide.svg'
import croppedImage5 from './assets/icons/cropped_Airplane.svg'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div className="wrapper">
<h1>SVG Cropper Gallery</h1>
<p>This is a comparison of converted SVG images before and after cropping.</p>
<div className="images-before">
    <p>Before:</p>
    <img src=${image1} />
    <img src=${image2} />
    <img src=${image3} />
    <img src=${image4} />
    <img src=${image5} />
  </div>
  <div className="images-after">
    <p>After:</p>
    <img src=${croppedImage1} />
    <img src=${croppedImage2} />
    <img src=${croppedImage3} />
    <img src=${croppedImage4} />
    <img src=${croppedImage5} />
  </div>
</div>
`
