import type {FC} from "react";
import type {SpecificationsProps} from "@/models/specification.model.ts";
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
                padding: "20px 0",
                position: "sticky",
                top: "40px",
            }}
        >
            <h3 style={{textAlign: "left", margin: "10px 0"}}>Specifications</h3>

            <List
                size="small"
                bordered={false}
                dataSource={visibleSpecifications}
                renderItem={(spec) => (
                    <List.Item
                        onClick={() => onSpecificationClick(spec.id)}
                        style={{
                            cursor: "pointer",
                            padding: "8px 12px",
                            backgroundColor:
                                spec.id === selectedSpecificationId
                                    ? "#f0f5fc"
                                    : spec.id === null && selectedSpecificationId === null
                                        ? "#f0f5fc"
                                        : "transparent",
                            marginBottom: "6px",
                            transition: "background 0.3s",
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