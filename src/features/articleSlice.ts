// src/store/articleSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { db } from '../firebase/config.ts';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import type { Article } from '../models/article.model.ts';

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
export const fetchArticles = createAsyncThunk<Article[]>(
    'articles/fetchArticles',
    async (_, { rejectWithValue }) => {
        try {
            const snapshot = await getDocs(articlesRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Failed to add article');
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
                state.error = action.payload as string || 'Failed to fetch articles';
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
                state.error = action.payload || 'Failed to add article';
            });
    },
});

export default articleSlice.reducer;
