// src/store/articleSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase/config.ts';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import type {Article} from '../models/article.model.ts';

const articlesRef = collection(db, 'articles');

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
    const snapshot = await getDocs(articlesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
});

export const addArticle = createAsyncThunk('articles/addArticle', async (article: Article) => {
    const docRef = await addDoc(articlesRef, {
        ...article,
        createdAt: new Date().toISOString()
    });
    return { ...article, id: docRef.id };
});

const articleSlice = createSlice({
    name: 'articles',
    initialState: {
        articles: [] as Article[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchArticles.pending, state => {
                state.loading = true;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload;
                // console.log(action.payload);
            })
            .addCase(addArticle.fulfilled, (state, action) => {
                state.articles.push(action.payload);
            });
    },
});

export default articleSlice.reducer;
