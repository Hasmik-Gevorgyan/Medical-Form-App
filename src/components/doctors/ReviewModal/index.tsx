import type {FC} from "react";
import type {AppDispatch, RootState} from "@/app/store.ts";
import type {Review, ReviewModalProps} from "@/models/review.model.ts";
import {useDispatch, useSelector} from "react-redux";
import {addReview, clearFieldError, clearFieldErrors} from "@/features/reviewSlice.ts";
import {Button, Form, Input, message, Modal, Rate} from "antd";
import {useEffect, useState} from "react";
import {Status} from "@/constants/enums.ts";
import {
    UserOutlined,
    StarFilled
} from '@ant-design/icons';


const ReviewModal: FC<ReviewModalProps> = ({setIsModalVisible, isModalVisible, doctorId}) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [reviewForm] = Form.useForm();
    const {fieldErrors, status} = useSelector((state: RootState) => state.reviews);
    const dispatch: AppDispatch = useDispatch();
    const NAME = "name";
    const SURNAME = "surname";
    const COMMENT = "comment";
    const RATING = "rating";

    useEffect(() => {
        updateInputStateChanges();
    }, [fieldErrors]);


    const updateInputStateChanges = () => {
        const fields = reviewForm.getFieldsValue();
        const areFieldsEmpty = Object.values(fields).every(value => !value);
        const isClientErrors = reviewForm.getFieldsError().some(({ errors }) => errors.length > 0);
        const isTouched = reviewForm.isFieldsTouched(true);
        const isServerErrors = Object.keys(fieldErrors).length > 0;

        setIsFormValid(isTouched && !isClientErrors && !areFieldsEmpty && !isServerErrors);
    };


    const handleReviewSubmit = async (review: Review) => {
        const reviewAction = await dispatch(addReview({ doctorId, ...review }));

        if (addReview.fulfilled.match(reviewAction)) {
            message.success("Review submitted successfully!");
            setIsModalVisible(false);
            reviewForm.resetFields();
            dispatch(clearFieldErrors());
        }
    }

    const handleReviewCancel = () => {
        setIsModalVisible(false);
        reviewForm.resetFields();
        dispatch(clearFieldErrors());
    }
    const isSubmitting = status === Status.LOADING;


    return (
        <Modal
            title="💬 Leave a Review"
            open={isModalVisible}
            onCancel={handleReviewCancel}
            footer={null}
            destroyOnHidden
            centered
            maskClosable={false}
        >
            <Form
                form={reviewForm}
                layout="vertical"
                onFieldsChange={updateInputStateChanges}
                onFinish={handleReviewSubmit}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        { required: true, message: "Name is required" },
                        { min: 2, message: "Name must be at least 2 characters" }
                    ]}
                    help={fieldErrors.name}
                    validateStatus={fieldErrors.name ? 'error' : undefined}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your first name"
                        onChange={() => dispatch(clearFieldError(NAME))}
                        style={{
                            borderRadius: 8,
                            height: 45,
                            paddingLeft: 12,
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Surname"
                    name="surname"
                    rules={[
                        { required: true, message: "Surname is required" },
                        { min: 2, message: "Surname must be at least 2 characters" }
                    ]}
                    help={fieldErrors.surname}
                    validateStatus={fieldErrors.surname ? 'error' : undefined}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your last name"
                        onChange={() => dispatch(clearFieldError(SURNAME))}
                        style={{
                            borderRadius: 8,
                            height: 45,
                            paddingLeft: 12,
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[
                        { required: true, message: "Comment is required" },
                        { min: 10, message: "Comment must be at least 10 characters" }
                    ]}
                    help={fieldErrors.comment}
                    validateStatus={fieldErrors.comment ? 'error' : undefined}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Write your feedback here..."
                        onChange={() => dispatch(clearFieldError(COMMENT))}
                        style={{
                            borderRadius: 8,
                            padding: 12,
                            backgroundColor: '#f9f9f9',
                            resize: 'none'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[
                        { required: true, message: "Rating is required" }
                    ]}
                    help={fieldErrors.rating}
                    validateStatus={fieldErrors.rating ? 'error' : undefined}
                >
                    <Rate
                        onChange={() => dispatch(clearFieldError(RATING))}
                        character={<StarFilled />}
                        style={{ color: '#FFAF00' }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        disabled={!isFormValid || isSubmitting}
                        block
                        style={{
                            borderRadius: 6,
                            background: 'linear-gradient(90deg, #a1c4fd, #c2e9fb)', // light blue gradient
                            fontWeight: 600,
                            color: '#fff', // white text
                            height: 45
                        }}
                    >
                        Submit Review
                    </Button>

                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ReviewModal;