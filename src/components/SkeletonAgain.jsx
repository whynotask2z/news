import React from "react";
import { Skeleton } from 'antd-mobile'
import "./SkeletonAgain.less"

const SkeletonAgain = () => {
    return <div className="SkeletonAgain-box">
        <Skeleton.Title animated />
        <Skeleton.Paragraph lineCount={10} animated />
    </div>
}
export default SkeletonAgain;