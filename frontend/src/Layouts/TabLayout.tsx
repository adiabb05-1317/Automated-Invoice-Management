import React,{useState} from 'react';
import './TabLayout.css'

interface Tab {
    label: string;
    content: React.ReactNode;
}
interface TabLayoutProps {
    tabs: Tab[]

}
const TabLayout: React.FC<TabLayoutProps> = ({tabs})=>{
    const [activeTab, setActiveTab] =useState(0);
    return (
        <div className="tab-layout">
            <div className="tabs">
                {tabs.map((tab,index)=>(
                    <div key={index} className={`tab ${activeTab === index? 'active-tab':''}`} onClick={()=>setActiveTab(index)}>
                        {tab.label}
                    </div>
                ))}

            </div>
            <div className="tab-content">{tabs[activeTab].content}</div>

        </div>
    );
    
}
export default TabLayout;

