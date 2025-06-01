// src/store/articleSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import type { Article } from '../models/article.model';
import { updateDoc } from 'firebase/firestore';

const articlesRef = collection(db, 'articles');

interface ArticleState {
    articles: Article[];
    loading: boolean;
    error: string | null;
}

const initialState: ArticleState = {
    articles: [],
    loading: false,
    error: null,
};

// Fetch Articles
export const fetchArticles = createAsyncThunk<Article[], void, { rejectValue: string }>(
    'articles/fetchArticles',
    async (_, { rejectWithValue }) => {
        try {
            const snapshot = await getDocs(articlesRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        } catch {
            return rejectWithValue('Failed to fetch articles');
        }
    }

);

// Add Article
export const addArticle = createAsyncThunk<Article, Article, { rejectValue: string }>(
    'articles/addArticle',
    async (article, { rejectWithValue }) => {
        if (!article.title?.trim()) {
            return rejectWithValue('Title is required');
        }
        if (!article.content?.trim()) {
            return rejectWithValue('Content is required');
        }

        try {
            const docRef = await addDoc(articlesRef, {
                ...article,
                createdAt: new Date().toISOString(),
            });
            return { ...article, id: docRef.id };
        } catch {
            return rejectWithValue('Failed to add article');
        }
    }
);

// Delete Article
export const deleteArticle = createAsyncThunk<string, string, { rejectValue: string }>(
    'articles/deleteArticle',
    async (id, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, 'articles', id));
            return id;
        } catch {
            return rejectWithValue('Failed to delete article');
        }
    }
);


export const updateArticle = createAsyncThunk<
    Article, // Return type after update
    Article, // Payload: article with updated fields (must include id)
    { rejectValue: string }
>(
    'articles/updateArticle',
    async (article, { rejectWithValue }) => {
        if (!article.id) {
            return rejectWithValue('Article ID is required');
        }
        if (!article.title?.trim()) {
            return rejectWithValue('Title is required');
        }
        if (!article.content?.trim()) {
            return rejectWithValue('Content is required');
        }
        try {
            const articleRef = doc(db, 'articles', article.id);
            await updateDoc(articleRef, {
                title: article.title,
                content: article.content,
                imageUrl: article.imageUrl || '',
                updatedAt: new Date().toISOString(),
                // add other fields you allow updating here
            });
            return article;
        } catch {
            return rejectWithValue('Failed to update article');
        }
    }
);

const articleSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // Fetch Articles
            .addCase(fetchArticles.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.loading = false;
                state.articles = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to fetch articles';
            })

            // Add Article
            .addCase(addArticle.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                state.loading = false;
                state.articles.push(action.payload);
            })
            .addCase(addArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to add article';
            })

            // Delete Article
            .addCase(deleteArticle.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.articles = state.articles.filter(article => article.id !== action.payload);
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to delete article';
            })
            // Update Article

            .addCase(updateArticle.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                state.loading = false;
                const index = state.articles.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.articles[index] = action.payload;
                }
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to update article';
            })

    },
});

export default articleSlice.reducer;

