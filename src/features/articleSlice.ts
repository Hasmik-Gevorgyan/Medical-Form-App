import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { db } from '../firebase/config';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    updateDoc,
    getCountFromServer,
} from 'firebase/firestore';
import type { Article } from '../models/article.model';

const articlesRef = collection(db, 'articles');

interface ArticleState {
    articles: Article[];      // Public articles
    myArticles: Article[];    // Logged-in user's articles
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    total: number;
    currentPage: number;
    currentArticle: Article | null;
}

const initialState: ArticleState = {
    articles: [],
    myArticles: [],
    loading: false,
    error: null,
    hasMore: true,
    total: 0,
    currentPage: 1,
    currentArticle: null,
};

// Fetch Articles by Page
export const fetchArticles = createAsyncThunk<
    { articles: Article[]; hasMore: boolean; total: number },
    { limit: number; page: number; userId?: string },
    { rejectValue: string }
>(
    'articles/fetchArticles',
    async ({ limit, page, userId }, { rejectWithValue }) => {
        try {
            const q = userId
                ? query(articlesRef, where('authorId', '==', userId), orderBy('createdAt', 'desc'))
                : query(articlesRef, orderBy('createdAt', 'desc'));

            const countSnap = await getCountFromServer(q);
            const total = countSnap.data().count;

            const allSnap = await getDocs(q);
            const allDocs = allSnap.docs;

            const start = (page - 1) * limit;
            const paginatedDocs = allDocs.slice(start, start + limit);

            const articles = paginatedDocs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
            const hasMore = start + limit < total;

            return { articles, hasMore, total };
        } catch {
            return rejectWithValue('Failed to fetch articles');
        }
    }
);

export const fetchArticleById = createAsyncThunk<Article, string, { rejectValue: string }>(
    'articles/fetchArticleById',
    async (id, { rejectWithValue }) => {
        try {
            const docRef = doc(db, 'articles', id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) throw new Error('Article not found');
            return { id: docSnap.id, ...docSnap.data() } as Article;
        } catch (error) {
            return rejectWithValue('Failed to fetch article');
        }
    }
);

// Add Article
export const addArticle = createAsyncThunk<Article, Article, { rejectValue: string }>(
    'articles/addArticle',
    async (article, { rejectWithValue }) => {
        if (!article.title?.trim()) return rejectWithValue('Title is required');
        if (!article.content?.trim()) return rejectWithValue('Content is required');

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

// Update Article
export const updateArticle = createAsyncThunk<Article, Article, { rejectValue: string }>(
    'articles/updateArticle',
    async (article, { rejectWithValue }) => {
        if (!article.id) return rejectWithValue('Article ID is required');
        if (!article.title?.trim()) return rejectWithValue('Title is required');
        if (!article.content?.trim()) return rejectWithValue('Content is required');

        try {
            const articleRef = doc(db, 'articles', article.id);
            await updateDoc(articleRef, {
                title: article.title,
                content: article.content,
                imageUrl: article.imageUrl || '',
                updatedAt: new Date().toISOString(),
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
    reducers: {
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchArticles.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.hasMore = action.payload.hasMore;
                state.total = action.payload.total;

                if (action.meta.arg.userId) {
                    state.myArticles = action.payload.articles;
                } else {
                    state.articles = action.payload.articles;
                }
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to fetch articles';
            })

            .addCase(addArticle.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                state.loading = false;
                state.articles.unshift(action.payload); // add to top of public articles
                state.total += 1;
            })
            .addCase(addArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to add article';
            })

            .addCase(deleteArticle.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteArticle.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.articles = state.articles.filter(article => article.id !== action.payload);
                state.myArticles = state.myArticles.filter(article => article.id !== action.payload);
                state.total -= 1;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to delete article';
            })

            .addCase(updateArticle.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateArticle.fulfilled, (state, action: PayloadAction<Article>) => {
                state.loading = false;

                const updateIn = (arr: Article[]) => {
                    const index = arr.findIndex(a => a.id === action.payload.id);
                    if (index !== -1) arr[index] = action.payload;
                };

                updateIn(state.articles);
                updateIn(state.myArticles);
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to update article';
            })
            .addCase(fetchArticleById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticleById.fulfilled, (state, action: PayloadAction<Article>) => {
                state.loading = false;
                state.currentArticle = action.payload;
            })
            .addCase(fetchArticleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to fetch article';
            })


    },
});

export const { setCurrentPage } = articleSlice.actions;
export default articleSlice.reducer;
