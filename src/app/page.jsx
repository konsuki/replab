// Client Component
'use client';

import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { CommentDisplay } from '../components/CommentDisplay';
import { CommentSearch } from '../components/CommentSearch'; 
import { VideoUrlInput } from '../components/VideoUrlInput'; // 新しくインポート

// FastAPIのURLを定義
// const YOUTUBE_API_URL = 'http://localhost:8000/api/comments'; 
const YOUTUBE_API_URL = 'https://backend-904463184290.asia-northeast1.run.app/api/comments';


export default function Home() {
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResult, setSearchResult] = useState(null); // Gemini検索結果を格納

    // YouTubeコメントを取得する関数 (videoIdを引数として受け取る)
    const fetchComments = async (videoId) => {
        // 取得開始時に、前の検索結果をリセット
        setSearchResult(null); 
        setApiData(null); 

        setLoading(true);
        setError(null);
        try {
            // URLに video_id クエリパラメータを付けて呼び出す
            const url = `${YOUTUBE_API_URL}?video_id=${videoId}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'error') {
                setError(data.message || 'コメント取得中にエラーが発生しました。');
                setApiData(data); // エラー情報も渡して CommentDisplay で表示できるようにする
            } else {
                setApiData(data);
            }
        } catch (e) {
            console.error('API呼び出しエラー:', e);
            setError('ネットワークエラーまたはAPI接続に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    // 💡 修正ポイント: ページロード時の自動取得をコメントアウトまたは削除
    // useEffect(() => {
    //   // デフォルトの動画IDを取得したい場合はここで fetchComments("fmFn2otWosE"); を呼び出す
    // }, []);


    return (
        <div className="container mx-auto p-4 md:p-8">
            <Header/>
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-50">
                YouTubeコメント分析ツール (Gemini連携)
            </h1>

            {/* 1. 動画URL入力コンポーネント (コメント取得アクションを実行) */}
            <VideoUrlInput onFetch={fetchComments} loading={loading} />

            {/* 2. データのロード/エラー表示 (LoadingAndErrorDisplay は page.jsx には含まれていないが、表示ロジックをここにシンプルに記述) */}
            {loading && <p className="text-blue-500">コメントを取得中...</p>}
            
            {/* 3. 検索コンポーネント (YouTubeコメント取得成功後のみ表示) */}
            {apiData && apiData.status === 'success' && apiData.comments && (
                <CommentSearch
                    comments={apiData.comments}
                    onSearchResult={setSearchResult} 
                />
            )}

            {/* 4. コメント表示コンポーネント (エラー表示もここで処理される) */}
            <CommentDisplay 
                apiData={apiData} 
                searchResultJson={searchResult}
            />
        </div>
    );
}