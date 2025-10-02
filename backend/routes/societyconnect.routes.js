const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../controllers/hostelcart/item");
const societyController = require("../controllers/SocietyConnect/society");
const authenticationSocietyAdmin = require('../middleware/authentication.societyadmin');
const societyAdminAuth = require('../controllers/SocietyConnect/societyAdminAuth');
const postsController = require('../controllers/SocietyConnect/posts');
const commentsController = require('../controllers/SocietyConnect/comments');
const authentication = require('../middleware/authentication');

// use memory storage because controller expects file.buffer
const upload = multer({ storage: multer.memoryStorage() });

/*
get all societies //open for all // main page thingy .....done
get particular society //open for all //main page thingy .....done

create society //only for admin ......done
delete society //only for admin .....done


update society //only for society admin .....done

get all posts of a society //open for all //implement pagination ....done
create post in a society //only for society admin ...done
update post in a society //only for society admin ...done
delete post in a society //only for society admin ...done


get all posts of all societies //open for all //main page thingy, implement pagination ....done


get particular post //open for all //gets comments, their likes and post likes
comment on a post //only for authenticated users, implement pagination ....done
like/unlike a post //only for authenticated users ...done
like/unlike a comment on a post //only for authenticated users ....done

*/


//society admin routes
router.put('/society/:id', authenticationSocietyAdmin, upload.array('images', 6), societyController.updateSociety);
router.post('/society-admin/login', societyAdminAuth.login);


// societies routes
router.get('/societies', societyController.getAllSocieties);
router.get('/societies/:id', societyController.getSocietyById);


//posts routes
router.get('/societies/:societyId/posts', postsController.getPostsBySociety);
router.post('/societies/:societyId/posts', authenticationSocietyAdmin, upload.array('images', 6), postsController.createPost);
router.put('/societies/:societyId/posts', authenticationSocietyAdmin, upload.array('images', 6), postsController.updatePost);
router.delete('/societies/:societyId/posts', authenticationSocietyAdmin, postsController.deletePost);


router.get('/posts', postsController.getAllPosts);
router.get('/posts/:postId', postsController.getPostById);


router.post('/posts/:postId/like', authentication, postsController.likePost);
router.post('/posts/:postId/unlike', authentication, postsController.unlikePost);



//comments
router.post('/posts/:postId/comments', authentication, commentsController.addComment);

router.get('/posts/:postId/comments', commentsController.getComments);

router.post('/comments/:commentId/like', authentication, commentsController.likeComment);
router.post('/comments/:commentId/unlike', authentication, commentsController.unlikeComment);

// Delete comment: allowed for comment owner (authentication) or society admin (authenticationSocietyAdmin)
router.delete('/comments/:commentId', authentication, commentsController.deleteComment);
router.delete('/comments/:commentId/admin', authenticationSocietyAdmin, commentsController.deleteComment);


module.exports = router;