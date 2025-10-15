import { BadRequestException, InternalServerErrorException, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";

export function handleException(error: any, defaultMessage: string): never {
    if (error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException) {
        throw error;
    }
    throw new InternalServerErrorException({ message: defaultMessage, detail: error?.message });
}