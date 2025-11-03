const resetPassTemplate = (username, resetLink)=>{
    return `
    <div>
    <h1>Hello ${username}</h1>
    <p>your reset password link is <a href = "${resetLink}">here </a></p>
    </div>
    `
}

module.exports = resetPassTemplate