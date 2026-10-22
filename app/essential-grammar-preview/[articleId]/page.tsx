import { Essential4Reader } from "../../Essential4Reader";
export default async function Page({params}:{params:Promise<{articleId:string}>}){ const {articleId}=await params;return <Essential4Reader articleId={articleId} mode="notes"/>;}
