const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Create an Express application
const app = express();
// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Specify the origin explicitly
    credentials: true // Allow credentials (cookies)
}));
app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//("k");

// MySQL database connection
const db = mysql.createPool({
    host: 'localhost',      // Your MySQL host
    user: 'root',           // Your MySQL username
    password: '',   // Your MySQL password
    database: 'dailydelight' // Your MySQL database name
});

// User signup route
app.post('/signup', async (req, res) => {
    const { user_id, username, email_id, password, gender = '', bio = '', profile_picture = '' } = req.body;

    // Validate input
    if (!user_id || !username || !email_id || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user ID already exists
        const checkUserQuery = 'SELECT * FROM users WHERE user_id = ?';
        db.query(checkUserQuery, [user_id], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(400).json({ message: 'User ID already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (user_id, username, email_id, password, gender, bio, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)';

            db.query(insertQuery, [user_id, username, email_id, hashedPassword, gender, bio, profile_picture], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'User registered successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User login route
app.post('/login', (req, res) => {
    //("getting hit");
    
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [user_id], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User does not exist' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Password incorrect' });

        const token = jwt.sign({ user_id: user.user_id }, 'your-secret-key', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.cookie('user_data', user.user_id, { httpOnly: true });
        res.json({ message: 'Login successful',Success:true, user_id: user.user_id });
    });
});

// Fetch user profile route
app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const query = 'SELECT * FROM User WHERE user_id = ?';
        db.query(query, [decoded.user_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            res.json({ data: results[0] });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/feed_posts', (req, res) => {
    const query = 'SELECT * FROM posts ORDER BY RAND() LIMIT 10'; // Assuming your posts table is named 'posts'

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json({
                Message: 'Posts fetched successfully',
                Success: true,
                data: results
            });
        } else {
            return res.json({
                Message: 'Posts not found',
                Success: false,
                data: []
            });
        }
    });
});
app.get('/user/', (req, res) => {
    // Retrieve user_id from cookies
    const user_id = req.cookies.user_data;
    //("this is user_id from cookies : ",user_id);
    
    if (!user_id) {
        return res.status(401).json({ message: 'Please log in first', success: false });
    }

    const query = 'SELECT * FROM users WHERE user_id = ?';

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'An error occurred while fetching user data',
                success: false,
                error: err.message
            });
        }

        if (results.length > 0) {
            return res.json({
                message: 'User fetched successfully',
                success: true,
                data: results
            });
        } else {
            return res.json({
                message: 'User not found',
                success: false,
                data: []
            });
        }
    });
});

app.get('/all_users', (req, res) => {
    const query = 'SELECT friends_id, request_sent_id, request_received_id,profile_picture, user_id, username, email_id FROM users ORDER BY RAND() LIMIT 7';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        //(results);
        
        if (results.length > 0) {
            return res.json({
                Message: 'users fetched successfully',
                Success: true,
                data: results
            });
        } else {
            return res.json({
                Message: 'users not found',
                Success: false,
                data: []
            });
        }
    });
});


app.get('/search_user', (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT * FROM users 
        WHERE user_id LIKE ? OR username LIKE ? 
        ORDER BY RAND() 
        LIMIT 10
    `;

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json({
                Message: 'users Searched successfully',
                Success: true,
                data: results
            });
        } else {
            return res.json({
                Message: 'Cannot Search',
                Success: false,
                data: []
            });
        }
    });
});


app.get('/user/posts', (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ message: 'user_id is required' });

    const query = 'SELECT * FROM Posts WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: results });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    //(`Server is running on port ${PORT}`);
});

app.post('/like', (req, res) => {
    let is_liked=false;
 
    const user_id = req.cookies.user_data;
    if (!user_id) {
        return res.status(400).json({ message: 'User ID not found in cookies', Success: false });
    }

    const { post_id } = req.body; 
    if (!post_id) {
        return res.status(400).json({ message: 'Post ID is required', Success: false });
    }

    
    const query = 'SELECT * FROM posts WHERE post_id = ?'; 
    db.query(query, [post_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Post not found', Success: false });

        const post = results[0]; 
        //(post); 

        
        let likedUsers = post.like_user_id;

   
        const userIndex = likedUsers.indexOf(user_id);
        if (userIndex > -1) {
           
            likedUsers.splice(userIndex, 1); 
            is_liked=false;
        } else {
           
            likedUsers.push(user_id);
            is_liked=true 
        }

        const updateQuery = 'UPDATE posts SET like_user_id = ? WHERE post_id = ?';
        db.query(updateQuery, [JSON.stringify(likedUsers), post_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });


            return res.json({
                message: 'Post like status updated successfully',
                Success: is_liked,
                post: {
                    post_id: post.post_id,
                }
            });
        });
    });
});
app.post('/send_follow', (req, res) => {
    const { user_id: currentUserId } = req.body; 
    const targetUserId = req.cookies.user_data; 

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

  
    const query = 'UPDATE users SET request_sent_id = JSON_ARRAY_APPEND(request_sent_id, "$", ?) WHERE user_id = ?';

    db.query(query, [targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Follow request sent successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});
app.post('/unfollow', (req, res) => {
    const { user_id: currentUserId } = req.body; 
    const targetUserId = req.cookies.user_data;

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

   
    const query = 'UPDATE users SET friends_id = JSON_REMOVE(friends_id, JSON_UNQUOTE(JSON_SEARCH(friends_id, "one", ?))) WHERE user_id = ?';

    db.query(query, [targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Unfollowed user successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});
app.post('/remove_follow_request', (req, res) => {
    const { user_id: currentUserId } = req.body; // The user ID to remove the follow request for
    const targetUserId = req.cookies.user_data; // Current user's ID from cookies

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

   
    const query = 'UPDATE users SET request_sent_id = JSON_REMOVE(request_sent_id, JSON_UNQUOTE(JSON_SEARCH(request_sent_id, "one", ?))) WHERE user_id = ?';

    db.query(query, [targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Removed follow request successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});

app.post('/accept_follow_request', (req, res) => {
    const { user_id: currentUserId } = req.body; 
    const targetUserId = req.cookies.user_data;

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

    
    const query = `
        UPDATE users 
        SET friends_id = JSON_ARRAY_APPEND(friends_id, "$", ?), 
            request_received_id = JSON_REMOVE(request_received_id, JSON_UNQUOTE(JSON_SEARCH(request_received_id, "one", ?))) 
        WHERE user_id = ? 
    `;

    db.query(query, [targetUserId, targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Follow request accepted successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});

app.get('/logout', (req, res) => {
    // Check if cookies exist
    if (!req.cookies.token || !req.cookies.user_data) {
        return res.status(400).json({ message: 'No user is logged in', Success: false });
    }

    // Clear the token and user_data cookies
    res.clearCookie('token');
    res.clearCookie('user_data');

    res.json({ message: 'Logout successful', Success: true });
});

app.get('/delete_account', (req, res) => {
    const { user_data: user_id } = req.cookies;

    if (!user_id) {
        return res.status(400).json({ message: 'User not logged in', Success: false });
    }


    // Delete all posts related to the user
    const deletePostsQuery = 'DELETE FROM posts WHERE user_id = ?';

    // Delete the user from the users table
    const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?';

    // First, delete the posts
    db.query(deletePostsQuery, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Then, delete the user
        db.query(deleteUserQuery, [user_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Clear the cookies after deletion
            res.clearCookie('token');
            res.clearCookie('user_data');
            res.json({ message: 'User account and related posts deleted successfully', Success: true });
        });
    });
});

app.get('/update_user', (req, res) => {
    const { user_data: user_id } = req.cookies;

    if (!user_id) {
        return res.status(400).json({ message: 'User not logged in', Success: false });
    }

    // SQL query to fetch the user from the users table
    const query = 'SELECT * FROM users WHERE user_id = ?';

    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found', Success: false });

        // Return the user details
        res.json({ message: 'User fetched successfully', Success: true, user: results[0] });
    });
});

app.post('/update_user_final', async (req, res) => {
    const userId = req.cookies.user_data; // Get user ID from cookie
    const { username, email_id, password, gender, bio, profile_picture } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID not found in cookies' });
    }
    try {
        // Only hash the password if it's provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null; // Hash password if provided
        const values = [username, email_id, hashedPassword, gender, bio, profile_picture, userId];

        // Prepare the update query with `?` placeholders
        const query = `
            UPDATE users
            SET username = ?, email_id = ?, password = ?, gender = ?, bio = ?, profile_picture = ?
            WHERE user_id = ?
        `;

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ message: 'User updated successfully' });
        });

    } catch (error) {
        console.error('Error updating user data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/user_profile', (req, res) => {
    const { user_id } = req.body;
    
    if (!user_id) return res.status(400).json({ message: 'User ID is required' });

    // Query to get the user details
    const userQuery = 'SELECT * FROM users WHERE user_id = ?';
    
    db.query(userQuery, [user_id], (err, userResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userResults.length === 0) return res.status(404).json({ message: 'User not found' });

       
            res.json({
                user: userResults[0],
                Success:true
        
        });
    });
});

app.post('/feed_posts_user', (req, res) => {
    //("Received body:", req.body); // Log the received body

    const { user_id } = req.body; // Extract user_id from the request body

    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required', Success: false });
    }

    const query = 'SELECT * FROM posts WHERE user_id = ?'; // Fetch posts for the specific user_id

    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json({
                Message: 'Posts fetched successfully',
                Success: true,
                data: results
            });
        } else {
            return res.json({
                Message: 'No posts found for this user',
                Success: false,
                data: []
            });
        }
    });
});

app.post('/is-liked', (req, res) => {
    //("na");
    
    const { post_id } = req.body;
    const user_id = req.cookies.user_data; // Assuming the user_id is stored in cookies
    //(post_id, user_id);
    
    if (!post_id) return res.status(400).json({ message: 'Post ID is required' });
    if (!user_id) return res.status(400).json({ message: 'User ID is required' });
    
    //("working");
    
    // Query to get the like_user_id from the posts table
    const likeQuery = 'SELECT like_user_id FROM posts WHERE post_id = ?';
    
    db.query(likeQuery, [post_id], (err, postResults) => {
        if (err) return res.status(500).json({ error: err.message });
        if (postResults.length === 0) return res.status(404).json({ message: 'Post not found' });
        //(postResults[0].like_user_id.includes(user_id));
  
                   // Check if the user_id exists in the like_user_id array
        const isLiked = postResults[0].like_user_id.includes(user_id);
   
            res.json({
                Success: true,
                isLiked:isLiked
                
            });
        
        
             

    });
});
// Delete comment route
app.delete('/comment/:comment_id', (req, res) => {
    const { comment_id } = req.params;
    const user_id = req.cookies.user_data; // Assuming user_id is stored in cookies

    if (!comment_id || !user_id) {
        return res.status(400).json({ message: 'Comment ID and User ID are required' });
    }

    // Check if the comment belongs to the user
    const checkCommentQuery = 'SELECT * FROM comments WHERE comment_id = ? AND user_id = ?';
    db.query(checkCommentQuery, [comment_id, user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Comment not found or not authorized' });

        // Delete the comment
        const deleteCommentQuery = 'DELETE FROM comments WHERE comment_id = ?';
        db.query(deleteCommentQuery, [comment_id], (deleteErr) => {
            if (deleteErr) return res.status(500).json({ error: deleteErr.message });

            res.json({
                message: 'Comment deleted successfully',
                success: true
            });
        });
    });
});

// fetch comment
app.get('/comments/:post_id', (req, res) => {
    const { post_id } = req.params;
    console.log("k",post_id)
    const query = `
        SELECT * FROM comments 
        WHERE post_id = ? 
        ORDER BY created_at ASC
    `;
    db.query(query, [post_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            message: 'Comments fetched successfully',
            success: true,
            data: results
        });
    });
});

// like comment
app.post('/like-comment', (req, res) => {
    const { comment_id } = req.body;
    const user_id = req.cookies.user_data;

    if (!comment_id || !user_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'SELECT * FROM comments WHERE comment_id = ?';
    db.query(query, [comment_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Comment not found' });

        const comment = results[0];
        let likedUsers = comment.like_user_id || [];

        const userIndex = likedUsers.indexOf(user_id);
        if (userIndex > -1) {
            likedUsers.splice(userIndex, 1); // Remove like
        } else {
            likedUsers.push(user_id); // Add like
        }

        const updateQuery = 'UPDATE comments SET like_user_id = ? WHERE comment_id = ?';
        db.query(updateQuery, [JSON.stringify(likedUsers), comment_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });

            res.json({
                message: 'Comment like status updated successfully',
                success: true,
                liked: userIndex === -1
            });
        });
    });
});
// comment route
app.post('/comment', (req, res) => {
    
    const { post_id, content, parent_comment_id = null } = req.body;

    const user_id = req.cookies.user_data;
    console.log("getting this ppppppppppp",post_id,user_id,content);
    if (!post_id || !user_id || !content) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
        INSERT INTO comments (post_id, user_id, content, parent_comment_id) 
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [post_id, user_id, content, parent_comment_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            message: 'Comment added successfully',
            success: true,
            comment_id: result.insertId
        });
    });
});

// app.post('/posts', (req, res) => {
//     const user_id = req.cookies.user_data; // Get user ID from cookies
//     const { text, image, category } = req.body; // Destructure text, image, and category from request body

//     // Take the first item from the category array
//     const categoryValue = Array.isArray(category) && category.length > 0 ? category[0] : null;
//    console.log(text,image,categoryValue);
   
//     const query = `
//         INSERT INTO posts (user_id, content, image_url, created_at, edited_at, category)
//         VALUES (?, ?, ?, NOW(), NOW(), ?)
//     `;

//     db.query(query, [user_id, text, image, categoryValue], (err, results) => {
//         if (err) {
//             console.error("Error creating post:", err.message);
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         res.status(201).json({
//             message: 'Post created successfully',
//             post_id: results.insertId, // Return the ID of the newly created post
//         });
//     });
// });

const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path'); // Make sure this line is included

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for image upload
// GET route to retrieve an image by filename
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log(filename);
    
    const imagePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.sendFile(imagePath);
    });
});

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Resize the image
        const resizedImageBuffer = await sharp(req.file.buffer)
            .resize(800, 800, { fit: 'inside' }) // Resize to max 800x800
            .toFormat('jpeg', { quality: 80 }) // Convert to JPEG with quality 80
            .toBuffer();

        // Save resized image to local storage
        const imagePath = path.join(__dirname, 'uploads', req.file.originalname);
        fs.writeFileSync(imagePath, resizedImageBuffer);

        // Store image URL in your database (example URL)
        const imageUrl = `http://localhost:${PORT}/uploads/${req.file.originalname}`;

        res.status(200).json({ message: 'Image uploaded successfully!', imageUrl });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Error uploading image' });
    }
});

// Endpoint for creating a post
app.post('/posts', (req, res) => {
    const user_id = req.cookies.user_data; // Get user ID from cookies
    const { text, image, category } = req.body; // Destructure from request body

    // Take the first item from the category array
    const categoryValue = Array.isArray(category) && category.length > 0 ? category[0] : null;

    const query = `
        INSERT INTO posts (user_id, content, image_url, created_at, edited_at, category, like_user_id, tag_user_id)
        VALUES (?, ?, ?, NOW(), NOW(), ?, ?, ?)
    `;

    // Set default values to user_id as JSON
    const likeUserId = JSON.stringify([user_id]); // Store user_id as a JSON array
    const tagUserId = JSON.stringify([user_id]);  // Store user_id as a JSON array

    db.query(query, [user_id, text, image, categoryValue, likeUserId, tagUserId], (err, results) => {
        if (err) {
            console.error("Error creating post:", err.message);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.status(201).json({
            message: 'Post created successfully',
            post_id: results.insertId, // Return the ID of the newly created post
        });
    });
});

app.get('/authenticate', (req, res) => {
   
  
     const user_id=req.cookies.user_data;
     if(user_id){
        return res.json({
            Message: 'User is Logged in',
            success: true,
        });
     }
         
        else{
            
            return res.json({
                Message: 'users not found',
                success: false,
            });
      
        }
});


