import { DashboardNav } from "../components/dashboard-nav";
import { DashboardChat } from "../components/dashboard-chat";

const DashboardPage = () => {
  return (
    <div className="flex flex-row w-screen h-screen">
      <DashboardNav />
      <DashboardChat />
    </div>
  );
};

export default DashboardPage;
