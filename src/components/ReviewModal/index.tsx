import type {FC} from "react";
import type {AppDispatch, RootState} from "@/app/store.ts";
import type {Review} from "@/models/review.model.ts";
import {useDispatch, useSelector} from "react-redux";
import {addReview, clearFieldError, clearFieldErrors} from "@/features/reviewSlice.ts";
import {Button, Form, Input, message, Modal, Rate} from "antd";
import {useEffect, useState} from "react";

const ReviewModal: FC<any> = ({setIsModalVisible, isModalVisible, doctorId}) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [reviewForm] = Form.useForm();
    const {fieldErrors} = useSelector((state: RootState) => state.reviews);
    const dispatch: AppDispatch = useDispatch();
    const NAME = "name";
    const SURNAME = "surname";
    const COMMENT = "comment";
    const RATING = "rating";

    useEffect(() => {
        updateInputStateChanges();
    }, [fieldErrors]);


    const updateInputStateChanges = () => {
        const isClientErrors = reviewForm
            .getFieldsError()
            .some(({ errors }) => errors.length > 0);
        const isTouched = reviewForm.isFieldsTouched(true);
        const isServerErrors = Object.keys(fieldErrors).length > 0;

        setIsFormValid(isTouched && !isClientErrors && !isServerErrors);
    }

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

    return (
        <Modal
            title="Leave a Review"
            open={isModalVisible}
            onCancel={handleReviewCancel}
            onOk={() => setIsModalVisible(false)}
            footer={null}
            destroyOnHidden
        >
            <Form form={reviewForm} layout="vertical"
                  onFieldsChange={updateInputStateChanges}
                  onFinish={handleReviewSubmit}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {required: true, message: "Name is required"},
                        {min: 2, message: "Name must be at least 2 characters"}
                    ]}
                    help={fieldErrors.name}
                    validateStatus={fieldErrors.name ? 'error' : undefined}
                >
                    <Input onChange={() => dispatch(clearFieldError(NAME))}
                           placeholder="Name"
                    />
                </Form.Item>

                <Form.Item
                    label="Surname"
                    name="surname"
                    rules={[
                        {required: true, message: "Surname is required"},
                        {min: 2, message: "Surname must be at least 2 characters"}
                    ]}
                    help={fieldErrors.surname}
                    validateStatus={fieldErrors.surname ? 'error' : undefined}
                >
                    <Input
                        onChange={() => dispatch(clearFieldError(SURNAME))}
                        placeholder="Surname"/>
                </Form.Item>

                <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[
                        {required: true, message: "Comment is required"},
                        {min: 10, message: "Comment must be at least 10 characters"}
                    ]}
                    help={fieldErrors.comment}
                    validateStatus={fieldErrors.comment ? 'error' : undefined}
                >
                    <Input.TextArea
                        rows={4}
                        onChange={() => dispatch(clearFieldError(COMMENT))}
                        placeholder="Write your review here"/>
                </Form.Item>

                <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[
                        {required: true, message: "Rating is required"}
                    ]}
                    help={fieldErrors.rating}
                    validateStatus={fieldErrors.rating ? 'error' : undefined}
                >
                    <Rate onChange={() => dispatch(clearFieldError(RATING))}/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={!isFormValid} block>
                        Submit Review
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ReviewModal;