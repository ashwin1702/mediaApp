const  Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");
exports.createPost = async(req,res)=>{
    try {
        const myCloud = await cloudinary.v2.uploader.upload(req.body.image,{
            folder:"posts",
        });



        const newPostData = {
            caption:req.body.caption,
            image:{
                public_id:myCloud.public_id,
                url:myCloud.secure_url,
            },
            owner:req.user._id
        };
        const post = await Post.create(newPostData);
        const user = await User.findById(req.user._id);
        user.posts.unshift(post._id);
        user.save();
        res.status(201).json({
            success:true,
            message:"Post Created",
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            mesaage:error.mesaage,
        })
    }
};

exports.deletePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post Not Found"
            })
        }
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        await cloudinary.v2.uploader.destroy(post.image.public_id);
        await post.remove();
        
        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();

        res.status(201).json({
            success:true,
            message:"Post Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.mesaage
        })
    }
}

exports.likeAndUnlikePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        //agr koi glt id dedeta hai toh
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post Not Found"
            })
        }
        //agr post already liked hai toh unliked ho jaayega
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index,1);
            await post.save();
            return res.status(200).json({
                message:"Post Unliked",
                success:true
            })
        }
        //agr post like nhi hai toh like hojayega
        else{
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({
                success: true,
                message:"Post Liked"
            }) 
        } 
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

exports.getPostOfFollowing = async(req,res)=>{
    try {
        
    const user = await User.findById(req.user._id);
    const posts = await Post.find({
        owner:{
            $in:user.following,
        },
    }).populate("owner likes comments.user");
    res.status(200).json({
        success:true,
        posts:posts.reverse(),
    })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};

exports.updateCaption = async(req,res)=>{
    try {
        const post =await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({
                success:false,
                message:"Post Not Found"
            })
        }
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        post.caption = req.body.caption;
        await post.save();
        res.status(200).json({
            success:true,
            message:"Caption Updated"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
};

exports.addComment = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post Not Found"
            })
        }
        //checking whether a comment is already exists or not for a user 
        let commentIndex = -1;
        post.comments.forEach((item,index)=>{
            if(item.user.toString()==req.user._id.toString()){
                commentIndex=index;
            }
        });
//if comment exists then we replace this comment
        if(commentIndex !== -1){
            post.comments[commentIndex].comment=req.body.comment;
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Comment Updated",
            })
        }
        else{
            post.comments.push({
            user:req.user._id,
            comment:req.body.comment,
        }); 
        
        await post.save();
        return res.status(200).json({
            success:true,
            message:"Comment Added Successfully"
        });
    }
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
};

exports.deleteComment = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post Not Found"
            })
        }
        //Cheching if owner wants to delete comment then he can delete any comment 
        if(post.owner.toString()==req.user._id){

            if(req.body.commentId==undefined){
                return res.status(400).json({
                    success:false,
                    message:"Comment Id required",
                })
            }
            post.comments.forEach((item,index)=>{
                if(item._id.toString()==req.body.commentId.toString()){
                    return post.comments.splice(index,1);
                }
            });

            await post.save();
            return res.status(200).json({
                success:true,
                message:"Selected Comment Deleted"
            })
        }
        //if a person wants to delete his comment 
        else{
            post.comments.forEach((item,index)=>{
                if(item.user.toString()==req.user._id.toString()){
                    return post.comments.splice(index,1);
                }
            });
            await post.save();
            return res.status(200).json({
                success:true,
                message:"Your Comment Deleted",
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }


}