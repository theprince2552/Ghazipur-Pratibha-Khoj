from rest_framework import serializers
from .models import User
from exams.models import StudentApplication
import re


# =========================================================
# REGISTER
# =========================================================

class RegisterSerializer(serializers.ModelSerializer):

    confirm_password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User

        fields = (
            "full_name",
            "email",
            "mobile",
            "password",
            "confirm_password",
        )

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    # -----------------------------------------------------
    # EMAIL VALIDATION
    # -----------------------------------------------------

    def validate_email(self, value):

        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already registered."
            )

        return value

    # -----------------------------------------------------
    # MOBILE VALIDATION
    # -----------------------------------------------------

    def validate_mobile(self, value):

        if len(value) != 10:

            raise serializers.ValidationError(
                "Mobile number must be 10 digits."
            )

        if not value.isdigit():

            raise serializers.ValidationError(
                "Mobile number must contain only digits."
            )

        if User.objects.filter(
            mobile=value
        ).exists():

            raise serializers.ValidationError(
                "Mobile already registered."
            )

        return value

    # -----------------------------------------------------
    # PASSWORD VALIDATION
    # -----------------------------------------------------

    def validate(self, attrs):

        password = attrs["password"]
        confirm_password = attrs[
            "confirm_password"
        ]

        # Password match
        if password != confirm_password:

            raise serializers.ValidationError({
                "confirm_password":
                    "Passwords do not match."
            })

        # Minimum 8 characters
        if len(password) < 8:

            raise serializers.ValidationError({
                "password":
                    "Password must be at least 8 characters."
            })

        # Uppercase
        if not re.search(
            r"[A-Z]",
            password
        ):

            raise serializers.ValidationError({
                "password":
                    "Password must contain at least one uppercase letter."
            })

        # Lowercase
        if not re.search(
            r"[a-z]",
            password
        ):

            raise serializers.ValidationError({
                "password":
                    "Password must contain at least one lowercase letter."
            })

        # Number
        if not re.search(
            r"\d",
            password
        ):

            raise serializers.ValidationError({
                "password":
                    "Password must contain at least one number."
            })

        # Special character
        if not re.search(
            r"[^A-Za-z0-9\s]",
            password
        ):

            raise serializers.ValidationError({
                "password":
                    "Password must contain at least one special character."
            })

        # No spaces
        if re.search(
            r"\s",
            password
        ):

            raise serializers.ValidationError({
                "password":
                    "Password cannot contain spaces."
            })

        return attrs

    # -----------------------------------------------------
    # CREATE USER
    # -----------------------------------------------------

    def create(self, validated_data):

        validated_data.pop(
            "confirm_password"
        )

        user = User.objects.create_user(
            full_name=validated_data[
                "full_name"
            ],

            email=validated_data[
                "email"
            ],

            mobile=validated_data[
                "mobile"
            ],

            password=validated_data[
                "password"
            ],
        )

        return user


# =========================================================
# VERIFY REGISTRATION OTP
# =========================================================

class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()

    otp = serializers.CharField(
        max_length=6,
        min_length=6
    )


# =========================================================
# LOGIN
# =========================================================

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )


# =========================================================
# FORGOT PASSWORD
# =========================================================

class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField()


# =========================================================
# RESET PASSWORD
# =========================================================

class ResetPasswordSerializer(serializers.Serializer):

    new_password = serializers.CharField(
        write_only=True
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    # -----------------------------------------------------
    # PASSWORD VALIDATION
    # -----------------------------------------------------

    def validate(self, attrs):

        password = attrs[
            "new_password"
        ]

        confirm_password = attrs[
            "confirm_password"
        ]

        # Password match
        if password != confirm_password:

            raise serializers.ValidationError({
                "confirm_password":
                    "Passwords do not match."
            })

        # Minimum 8 characters
        if len(password) < 8:

            raise serializers.ValidationError({
                "new_password":
                    "Password must be at least 8 characters."
            })

        # Uppercase
        if not re.search(
            r"[A-Z]",
            password
        ):

            raise serializers.ValidationError({
                "new_password":
                    "Password must contain at least one uppercase letter."
            })

        # Lowercase
        if not re.search(
            r"[a-z]",
            password
        ):

            raise serializers.ValidationError({
                "new_password":
                    "Password must contain at least one lowercase letter."
            })

        # Number
        if not re.search(
            r"\d",
            password
        ):

            raise serializers.ValidationError({
                "new_password":
                    "Password must contain at least one number."
            })

        # Special character
        if not re.search(
            r"[^A-Za-z0-9\s]",
            password
        ):

            raise serializers.ValidationError({
                "new_password":
                    "Password must contain at least one special character."
            })

        # No spaces
        if re.search(
            r"\s",
            password
        ):

            raise serializers.ValidationError({
                "new_password":
                    "Password cannot contain spaces."
            })

        return attrs

# =========================================================
# ADMIN STUDENT MANAGEMENT
# =========================================================

class AdminStudentCreateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=True
    )

    class Meta:
        model = User

        fields = (
            "full_name",
            "email",
            "mobile",
            "password",
        )

        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already registered."
            )

        return value

    def validate_mobile(self, value):

        if len(value) != 10:
            raise serializers.ValidationError(
                "Mobile number must be 10 digits."
            )

        if not value.isdigit():
            raise serializers.ValidationError(
                "Mobile number must contain only digits."
            )

        if User.objects.filter(mobile=value).exists():
            raise serializers.ValidationError(
                "Mobile already registered."
            )

        return value

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User.objects.create_user(
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            mobile=validated_data["mobile"],
            password=password,
        )

        # Admin-created student is already verified.
        user.is_verified = True
        user.is_active = True
        user.role = "student"

        user.save(
            update_fields=[
                "is_verified",
                "is_active",
                "role",
            ]
        )

        # -----------------------------------------------------
        # AUTOMATIC STUDENT APPLICATION
        # -----------------------------------------------------
        StudentApplication.objects.create(
            user=user,
            student_full_name=user.full_name,
            father_name="",
            mother_name="",
            aadhar_number="",
            gender="other",
            mobile_number=user.mobile,
            student_class="",
            school_name="",
            board="OTHER",
            village="",
            post="",
            pin_code="",
            district="Ghazipur",
            state="Uttar Pradesh",
            status="draft",
        )

        return user


class AdminStudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = (
            "id",
            "full_name",
            "email",
            "mobile",
            "role",
            "is_verified",
            "is_active",
            "date_joined",
        )

        read_only_fields = (
            "id",
            "email",
            "mobile",
            "role",
            "is_verified",
            "date_joined",
        )


class AdminStudentUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = (
            "full_name",
            "email",
            "mobile",
            "is_active",
        )

        extra_kwargs = {
            "email": {
                "required": False
            },
            "mobile": {
                "required": False
            },
            "full_name": {
                "required": False
            },
            "is_active": {
                "required": False
            },
        }

    def validate_email(self, value):

        user = self.instance

        if User.objects.filter(
            email=value
        ).exclude(
            id=user.id
        ).exists():

            raise serializers.ValidationError(
                "Email already registered."
            )

        return value

    def validate_mobile(self, value):

        if len(value) != 10:
            raise serializers.ValidationError(
                "Mobile number must be 10 digits."
            )

        if not value.isdigit():
            raise serializers.ValidationError(
                "Mobile number must contain only digits."
            )

        user = self.instance

        if User.objects.filter(
            mobile=value
        ).exclude(
            id=user.id
        ).exists():

            raise serializers.ValidationError(
                "Mobile already registered."
            )

        return value    