import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db, Blog } from '@/lib/firebase';

const COLLECTION_NAME = 'blogs';

// Fetch all blog posts
export async function getAllBlogs(): Promise<Blog[]> {
  try {
    const blogsCollection = collection(db, COLLECTION_NAME);
    const blogsQuery = query(blogsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(blogsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate()
    } as Blog));
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

// Fetch a single blog post by ID
export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate()
    } as Blog;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    return null;
  }
}

// Create a new blog post
export async function createBlog(blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog | null> {
  try {
    const blogsCollection = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(blogsCollection, {
      ...blog,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Fetch the newly created document to return it with the server timestamp
    return getBlogById(docRef.id);
  } catch (error) {
    console.error('Error creating blog:', error);
    return null;
  }
}

// Update an existing blog post
export async function updateBlog(id: string, updates: Partial<Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Blog | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    // Fetch the updated document to return it with the new server timestamp
    return getBlogById(id);
  } catch (error) {
    console.error(`Error updating blog with ID ${id}:`, error);
    return null;
  }
}

// Delete a blog post
export async function deleteBlog(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting blog with ID ${id}:`, error);
    return false;
  }
}

// Search blogs by query
export async function searchBlogs(searchTerm: string): Promise<Blog[]> {
  try {
    // Firebase doesn't support full-text search natively
    // This is a simple client-side implementation
    const blogs = await getAllBlogs();
    const lowercaseQuery = searchTerm.toLowerCase();
    
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(lowercaseQuery) ||
      blog.content.toLowerCase().includes(lowercaseQuery) ||
      blog.category.toLowerCase().includes(lowercaseQuery) ||
      blog.excerpt.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching blogs:', error);
    return [];
  }
}

// Filter blogs by category
export async function getBlogsByCategory(category: string): Promise<Blog[]> {
  try {
    const blogsCollection = collection(db, COLLECTION_NAME);
    const blogsQuery = query(
      blogsCollection, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(blogsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate()
    } as Blog));
  } catch (error) {
    console.error(`Error fetching blogs with category ${category}:`, error);
    return [];
  }
}
