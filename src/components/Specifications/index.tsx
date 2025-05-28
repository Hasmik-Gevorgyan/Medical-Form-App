import type {FC} from "react";
import type {SpecificationsProps} from "../../models/specification.model.ts";
import {Button, List} from "antd";

const Specifications: FC<SpecificationsProps> = ({
     specifications,
     selectedSpecificationId,
     showAllSpecs,
     onSpecificationClick,
     onToggleShowAll
 }) => {
    const visibleSpecifications = showAllSpecs
        ? [{id: null, name: "All"}, ...specifications]
        : [{id: null, name: "All"}, ...specifications.slice(0, 10)];

    return (
        <div
            style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                backgroundColor: "#fff",
                position: "sticky",
                top: "20px",
            }}
        >
            <h3 style={{textAlign: "center", marginBottom: "16px"}}>Specifications</h3>

            <List
                size="small"
                bordered
                dataSource={visibleSpecifications}
                renderItem={(spec) => (
                    <List.Item
                        onClick={() => onSpecificationClick(spec.id)}
                        style={{
                            cursor: "pointer",
                            backgroundColor: spec.id === selectedSpecificationId ? "#e6f7ff" : "#fff",
                            transition: "background-color 0.3s",
                        }}
                    >
                        {spec.name}
                    </List.Item>
                )}
            />

            {specifications.length > 10 && (
                <div style={{textAlign: "center", marginTop: "10px"}}>
                    <Button type="link" onClick={onToggleShowAll}>
                        {showAllSpecs ? "Show Less" : "Show All"}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Specifications;