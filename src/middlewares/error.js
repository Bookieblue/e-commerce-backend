export const Error= (req, res) =>{
    res.status(500).json({success:false, message: "Internal Sever Error"})
}