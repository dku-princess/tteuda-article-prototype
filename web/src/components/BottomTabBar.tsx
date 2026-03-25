import {
  bottomTabIconArticles,
  bottomTabIconFeed,
  bottomTabIconHome,
  bottomTabIconMypage,
  bottomTabIconWorks,
} from "@/assets/bottomTabIcons";

interface BottomTabBarProps {
  active?: "articles" | "home" | "works" | "feed" | "mypage";
}

export function BottomTabBar({ active = "articles" }: BottomTabBarProps) {
  const tabs: {
    key: BottomTabBarProps["active"];
    label: string;
    icon: string;
  }[] = [
    { key: "articles", label: "아티클", icon: bottomTabIconArticles },
    { key: "home", label: "홈", icon: bottomTabIconHome },
    { key: "works", label: "작품", icon: bottomTabIconWorks },
    { key: "feed", label: "피드", icon: bottomTabIconFeed },
    { key: "mypage", label: "마이페이지", icon: bottomTabIconMypage },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 h-[72px] w-full max-w-[430px] -translate-x-1/2 bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)]">
      <div className="flex h-full items-center justify-between px-9 pt-3 pb-5">
        {tabs.map((tab) => {
          const isActive = tab.key === active;

          const iconColor = isActive ? "#0ABE8C" : "#A6A6A6";
          const labelColor = isActive ? "text-[#0ABE8C]" : "text-[#A6A6A6]";

          return (
            <button
              key={tab.key}
              type="button"
              className="flex flex-col items-center gap-1"
            >
              <span className="mb-0.5 h-5 w-5" aria-hidden="true">
                <img
                  src={tab.icon}
                  alt=""
                  width={20}
                  height={20}
                  style={{ display: "block", filter: isActive ? undefined : "grayscale(100%)" }}
                />
              </span>
              <span
                className={`text-[10px] font-medium ${labelColor} whitespace-nowrap`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

