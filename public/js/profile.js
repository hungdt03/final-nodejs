const uploadAvatarBtn = document.getElementById('upload-avatar');
const avatarImg = document.getElementById('avatar-img')
const btnSaveAvatar = document.getElementById('btn-save-avatar')

uploadAvatarBtn.onchange = (e) => {
    const file = e.target.files[0]

    if (file) {
        const reader = new FileReader();

        // Đọc file dưới dạng DataURL (base64)
        reader.readAsDataURL(file);

        reader.onload = function (e) {
            avatarImg.src = e.target.result;
            btnSaveAvatar.classList.remove('hidden')
        };


    }
}