import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./widget/UserContext";
import Layout from "./scence/Layout";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import IndexPage from "./components/IndexPage";
import CreatePost from "./components/CreatePost";
import PostPage from "./components/PostPage";
import EditPost from "./components/EditPost";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
